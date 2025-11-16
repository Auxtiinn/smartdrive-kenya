package com.smartdrive.kenya.ui.screens.auth

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartdrive.kenya.data.model.Profile
import com.smartdrive.kenya.data.model.User
import com.smartdrive.kenya.data.model.UserRole
import com.smartdrive.kenya.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
// import io.github.jan.supabase.auth.SessionStatus
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()
    
    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser.asStateFlow()
    
    private val _userProfile = MutableStateFlow<Profile?>(null)
    val userProfile: StateFlow<Profile?> = _userProfile.asStateFlow()
    
    val userRole: UserRole?
        get() = _userProfile.value?.role
    
    init {
        observeAuthState()
        checkCurrentUser()
    }
    
    private fun observeAuthState() {
        viewModelScope.launch {
            authRepository.getSessionStatus().collect { isAuthenticated ->
                if (isAuthenticated) {
                    val user = authRepository.getCurrentUser()
                    _currentUser.value = user
                    user?.let { loadUserProfile(it.id) }
                } else {
                    _currentUser.value = null
                    _userProfile.value = null
                }
            }
        }
    }
    
    private fun checkCurrentUser() {
        viewModelScope.launch {
            val user = authRepository.getCurrentUser()
            _currentUser.value = user
            user?.let { loadUserProfile(it.id) }
        }
    }
    
    private fun loadUserProfile(userId: String) {
        viewModelScope.launch {
            authRepository.getUserProfile(userId).fold(
                onSuccess = { profile ->
                    _userProfile.value = profile
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        error = error.message
                    )
                }
            )
        }
    }
    
    fun signIn(email: String, password: String) {
        if (!validateInput(email, password)) return
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true, error = null)
            
            authRepository.signIn(email, password).fold(
                onSuccess = { user ->
                    _currentUser.value = user
                    _uiState.value = _uiState.value.copy(loading = false)
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        loading = false,
                        error = error.message ?: "Sign in failed"
                    )
                }
            )
        }
    }
    
    fun signUp(email: String, password: String, fullName: String) {
        if (!validateSignUpInput(email, password, fullName)) return
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true, error = null)
            
            authRepository.signUp(email, password, fullName).fold(
                onSuccess = { user ->
                    _currentUser.value = user
                    _uiState.value = _uiState.value.copy(loading = false)
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        loading = false,
                        error = error.message ?: "Sign up failed"
                    )
                }
            )
        }
    }
    
    fun signOut() {
        viewModelScope.launch {
            authRepository.signOut()
            _currentUser.value = null
            _userProfile.value = null
        }
    }
    
    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
    
    private fun validateInput(email: String, password: String): Boolean {
        when {
            email.isBlank() -> {
                _uiState.value = _uiState.value.copy(error = "Email is required")
                return false
            }
            !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches() -> {
                _uiState.value = _uiState.value.copy(error = "Invalid email format")
                return false
            }
            password.isBlank() -> {
                _uiState.value = _uiState.value.copy(error = "Password is required")
                return false
            }
            password.length < 6 -> {
                _uiState.value = _uiState.value.copy(error = "Password must be at least 6 characters")
                return false
            }
        }
        return true
    }
    
    private fun validateSignUpInput(email: String, password: String, fullName: String): Boolean {
        when {
            fullName.isBlank() -> {
                _uiState.value = _uiState.value.copy(error = "Full name is required")
                return false
            }
            !validateInput(email, password) -> return false
        }
        return true
    }
}

data class AuthUiState(
    val loading: Boolean = false,
    val error: String? = null
)
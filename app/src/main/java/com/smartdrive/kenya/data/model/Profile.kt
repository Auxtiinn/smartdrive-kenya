package com.smartdrive.kenya.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Profile(
    val id: String,
    val userId: String,
    val fullName: String? = null,
    val avatarUrl: String? = null,
    val role: UserRole = UserRole.CUSTOMER,
    val phone: String? = null,
    val signupSource: String? = null,
    val createdAt: String,
    val updatedAt: String? = null
) {
    companion object {
        const val TABLE_NAME = "profiles"
    }
}
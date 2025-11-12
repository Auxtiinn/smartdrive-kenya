package com.smartdrive.kenya.data.model

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: String,
    val email: String,
    val createdAt: String,
    val updatedAt: String? = null
)


@Serializable
enum class UserRole(val value: String) {
    ADMIN("admin"),
    AGENT("agent"),
    CUSTOMER("customer");

    companion object {
        fun fromString(value: String): UserRole {
            return entries.find { it.value == value } ?: CUSTOMER
        }
    }
}
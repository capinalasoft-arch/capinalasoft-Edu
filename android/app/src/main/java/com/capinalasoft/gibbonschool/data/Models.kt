package com.capinalasoft.gibbonschool.data

import kotlinx.serialization.Serializable

@Serializable
data class StudentDto(
    val gibbonPersonID: Int,
    val surname: String? = null,
    val preferredName: String? = null,
    val officialName: String? = null,
    val email: String? = null,
    val formGroup: String? = null,
    val yearGroup: String? = null,
)

package com.capinalasoft.gibbonschool.data

import retrofit2.http.GET
import retrofit2.http.Query

interface GibbonApi {
    @GET("/students")
    suspend fun getStudents(
        @Query("limit") limit: Int = 50,
        @Query("offset") offset: Int = 0,
    ): List<StudentDto>
}

package com.capinalasoft.gibbonschool.data

import com.capinalasoft.gibbonschool.BuildConfig
import com.jakewharton.retrofit2.converter.kotlinx.serialization.asConverterFactory
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit

object Network {
    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
    }

    private val okHttp: OkHttpClient by lazy {
        val logger = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BASIC
        }

        OkHttpClient.Builder()
            .addInterceptor { chain ->
                val newReq = chain.request().newBuilder()
                    .addHeader("X-API-Key", BuildConfig.API_KEY)
                    .build()
                chain.proceed(newReq)
            }
            .addInterceptor(logger)
            .build()
    }

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BuildConfig.BASE_URL)
            .client(okHttp)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()
    }

    val api: GibbonApi by lazy { retrofit.create(GibbonApi::class.java) }
}

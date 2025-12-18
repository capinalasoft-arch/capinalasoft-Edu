package com.capinalasoft.gibbonschool.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.capinalasoft.gibbonschool.data.Network
import com.capinalasoft.gibbonschool.data.StudentDto

@Composable
fun StudentListScreen() {
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    var students by remember { mutableStateOf<List<StudentDto>>(emptyList()) }

    LaunchedEffect(Unit) {
        loading = true
        error = null
        try {
            students = Network.api.getStudents(limit = 50, offset = 0)
        } catch (t: Throwable) {
            error = t.message ?: "Erro ao carregar"
        } finally {
            loading = false
        }
    }

    Column(modifier = Modifier.fillMaxSize()) {
        Text(
            text = "Alunos",
            style = MaterialTheme.typography.headlineSmall,
            modifier = Modifier.fillMaxWidth(),
        )
        Spacer(modifier = Modifier.height(8.dp))

        when {
            loading -> {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
                    CircularProgressIndicator()
                }
            }

            error != null -> {
                Text(
                    text = "Falha: ${error}",
                    color = MaterialTheme.colorScheme.error,
                )
                Text(
                    text = "Dica: confirme BASE_URL (10.0.2.2), API_KEY e se a API está rodando.",
                    style = MaterialTheme.typography.bodySmall,
                )
            }

            else -> {
                LazyColumn(contentPadding = PaddingValues(vertical = 8.dp)) {
                    items(students) { s ->
                        Column(modifier = Modifier.fillMaxWidth()) {
                            Text(
                                text = listOfNotNull(s.preferredName, s.surname).joinToString(" ")
                                    .ifBlank { s.officialName ?: "(Sem nome)" },
                                fontWeight = FontWeight.SemiBold,
                            )
                            Text(
                                text = listOfNotNull(s.yearGroup, s.formGroup).joinToString(" • ")
                                    .ifBlank { "ID: ${s.gibbonPersonID}" },
                                style = MaterialTheme.typography.bodySmall,
                            )
                            Divider()
                        }
                    }
                }
            }
        }
    }
}

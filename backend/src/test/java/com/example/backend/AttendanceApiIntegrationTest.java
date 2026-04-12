package com.example.backend;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AttendanceApiIntegrationTest {

    private static final Pattern ID_PATTERN = Pattern.compile("\"id\"\\s*:\\s*(\\d+)");

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void shouldCreateAlumnoAndRegisterAttendanceFlow() throws Exception {
        String alumnoPayload = """
                {
                  "nombre": "Maria Lopez",
                  "dni": "12345678",
                  "correo": "maria@colegio.com"
                }
                """;

        String alumnoResponse = mockMvc.perform(post("/api/alumnos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(alumnoPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Maria Lopez"))
                .andExpect(jsonPath("$.dni").value("12345678"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long alumnoId = readId(alumnoResponse);

        String asistenciaPayload = """
                {
                  "alumnoId": %d,
                  "fecha": "2026-03-20",
                  "estado": "PRESENTE",
                  "observacion": "Ingreso a tiempo"
                }
                """.formatted(alumnoId);

        String asistenciaResponse = mockMvc.perform(post("/api/asistencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asistenciaPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.alumnoId").value(alumnoId))
                .andExpect(jsonPath("$.estado").value("PRESENTE"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long asistenciaId = readId(asistenciaResponse);

        mockMvc.perform(get("/api/asistencias")
                        .param("alumnoId", alumnoId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(asistenciaId))
                .andExpect(jsonPath("$[0].alumnoNombre").value("Maria Lopez"));

        String actualizacionPayload = """
                {
                  "alumnoId": %d,
                  "fecha": "2026-03-20",
                  "estado": "TARDE",
                  "observacion": "Llego diez minutos tarde"
                }
                """.formatted(alumnoId);

        mockMvc.perform(put("/api/asistencias/{id}", asistenciaId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(actualizacionPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("TARDE"))
                .andExpect(jsonPath("$.observacion").value("Llego diez minutos tarde"));

        mockMvc.perform(delete("/api/asistencias/{id}", asistenciaId))
                .andExpect(status().isNoContent());

        mockMvc.perform(delete("/api/alumnos/{id}", alumnoId))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturnConflictWhenDuplicatingAttendanceForSameAlumnoAndDate() throws Exception {
        String alumnoPayload = """
                {
                  "nombre": "Jose Perez",
                  "dni": "87654321",
                  "correo": "jose@colegio.com"
                }
                """;

        String alumnoResponse = mockMvc.perform(post("/api/alumnos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(alumnoPayload))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long alumnoId = readId(alumnoResponse);

        String asistenciaPayload = """
                {
                  "alumnoId": %d,
                  "fecha": "2026-03-21",
                  "estado": "AUSENTE",
                  "observacion": "No asistio"
                }
                """.formatted(alumnoId);

        mockMvc.perform(post("/api/asistencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asistenciaPayload))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/asistencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asistenciaPayload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("El alumno ya tiene una asistencia registrada para esa fecha"));
    }

    @Test
    void shouldReturnValidationErrorsForInvalidAlumno() throws Exception {
        String alumnoPayload = """
                {
                  "nombre": "",
                  "dni": "12",
                  "correo": "correo-invalido"
                }
                """;

        mockMvc.perform(post("/api/alumnos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(alumnoPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("La solicitud contiene datos invalidos"))
                .andExpect(jsonPath("$.details.length()").value(3));
    }

    private Long readId(String json) throws Exception {
        Matcher matcher = ID_PATTERN.matcher(json);
        if (!matcher.find()) {
            throw new IllegalStateException("No se pudo extraer el id del JSON: " + json);
        }
        return Long.parseLong(matcher.group(1));
    }
}

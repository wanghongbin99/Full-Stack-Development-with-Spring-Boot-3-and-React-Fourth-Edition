package com.packt.cardatabase;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@SpringBootTest
@AutoConfigureMockMvc
public class CarRestTest {
    // This class is used to test the REST API of the CarController.
    // It uses Spring's MockMvc to perform requests and verify responses.
    // The @SpringBootTest annotation is used to load the application context for
    // integration tests.
    // The @AutoConfigureMockMvc annotation is used to configure MockMvc for
    // testing.
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testAuthentication() throws Exception {
        // Testing authentication with correct credentials
        this.mockMvc
                .perform(post("/login")
                        .content("{\"username\":\"admin\",\"password\":\"admin\"}")
                        .header(HttpHeaders.CONTENT_TYPE, "application/json"))
                .andDo(print()).andExpect(status().isOk());
    }

}

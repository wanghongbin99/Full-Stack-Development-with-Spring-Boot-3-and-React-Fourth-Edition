package com.packt.cardatabase;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.packt.cardatabase.web.CarController;
import static org.assertj.core.api.Assertions.assertThat;
// @SpringBootTest annotation is used to load the application context for integration tests.
@SpringBootTest
class CardatabaseApplicationTests {

	@Autowired
	private CarController carController;


	@Test
	@DisplayName("Test if CarController is loaded in the application context")
	// This test checks if the CarController bean is loaded in the application context.
	void contextLoads() {
		assertThat(carController).isNotNull();
	}

}

package com.packt.cardatabase.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.packt.cardatabase.CardatabaseApplication;
import com.packt.cardatabase.domain.Car;

@Service
public class CarService {

	private static final Logger logger = LoggerFactory.getLogger(
			CarService.class);
    @PreAuthorize("hasRole('USER')")
    public void updateCar(Car car) {
        // Logic to update the car in the database
        logger.info("Updating car with id: {}", car.getId());
    }
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCar(Long id) {
        // Logic to delete the car from the database
        logger.info("Deleting car with id: {}", id);

    }



}

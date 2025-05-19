package com.packt.cardatabase.domain;

import java.util.List;

import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
@EnableJpaRepositories
public interface CarRepository extends CrudRepository<Car, Long>{
    // This interface will automatically provide CRUD operations for Car entities
    // No need to implement any methods, Spring Data JPA will handle it
    public List<Car> findByBrand(@Param("brand") String brand);
    public List<Car> findByColor(@Param("color") String color);

}

package com.packt.cardatabase.domain;

import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
@EnableJpaRepositories
public interface OwnerRepository extends CrudRepository<Owner, Long> {
    // This interface will automatically provide CRUD operations for Owner entities
    // No need to implement any methods, Spring Data JPA will handle it
    public Owner findByFirstname(String firstname);

}

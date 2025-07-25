package com.drcp.backend.repository;

import com.drcp.backend.entity.Resources;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourcesRepository extends JpaRepository<Resources, Long> {

    Optional<List<Resources>>findByDisasterId(Long disasterId);
}

package com.drcp.backend.repository;

import com.drcp.backend.entity.Disasters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisastersRepository  extends JpaRepository<Disasters, Long> {

}

package com.drcp.backend.service;

import com.drcp.backend.entity.Reports;
import com.drcp.backend.repository.ReportsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportsService {

    @Autowired
    private ReportsRepository reportsRepository;

    public Reports saveReport(Reports report){
        return reportsRepository.save(report);
    }

    public List<Reports> fetchAllReports(){
        return reportsRepository.findAll();
    }

    public ResponseEntity<?> deleteAllReports(){
        reportsRepository.deleteAll();
        return ResponseEntity.ok("Deleted");
    }
}

package com.drcp.backend.controller;

import com.drcp.backend.entity.Reports;
import com.drcp.backend.service.ReportsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;


@RestController
@RequestMapping("/reports")
public class ReportsController {

    @Autowired
    private ReportsService reportsService;

    @PostMapping
    public ResponseEntity<?> createNewReport(@RequestBody Reports report, Principal principal) throws JsonProcessingException {
        report.setOwnerId(principal.getName());
        report.setVerificationStatus("created");
        report.setAuditTrail("Created by: "+principal.getName()+" at: "+ LocalDateTime.now());
        Reports savedReport=reportsService.saveReport(report);
        return ResponseEntity.ok(savedReport);
    }

    @GetMapping
    public ResponseEntity<?> getAllReports(){
        return ResponseEntity.ok(reportsService.fetchAllReports());
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAllReports(){
        return ResponseEntity.ok(reportsService.deleteAllReports());
    }
}

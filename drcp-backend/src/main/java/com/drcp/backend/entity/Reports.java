package com.drcp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.jetbrains.annotations.NotNull;

@Entity
@Table(name = "reports")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Reports {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String type;

    @NotNull
    private Long typeId;

    private String ownerId;

    @NotNull
    private String content;

    private String verificationStatus;

    private String auditTrail;

    @NotNull
    private String images;
}

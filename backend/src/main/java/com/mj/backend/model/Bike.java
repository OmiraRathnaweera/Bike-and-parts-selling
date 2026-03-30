package com.mj.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bikes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String tagline;

    @Column(nullable = false)
    private String category;    // SCOOTER | PREMIUM | MOTORCYCLE

    @Column(nullable = false)
    private Long price;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false, unique = true)
    private String slug;

    private boolean stock = true;

    @Column(name = "spec_power")
    private String specPower;

    @Column(name = "spec_torque")
    private String specTorque;

    @Column(name = "spec_engine")
    private String specEngine;

    @Column(columnDefinition = "LONGTEXT")
    private String image;

    @OneToMany(mappedBy = "bike", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private List<BikeSpecGroup> specGroups = new ArrayList<>();

    @OneToMany(mappedBy = "bike", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private List<BikeColor> colors = new ArrayList<>();
}
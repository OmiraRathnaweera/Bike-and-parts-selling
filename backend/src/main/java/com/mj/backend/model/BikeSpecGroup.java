package com.mj.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bike_spec_groups")
@Data @NoArgsConstructor @AllArgsConstructor
public class BikeSpecGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bike_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Bike bike;

    @Column(nullable = false)
    private String title; // "ENGINE", "BRAKES"

    @Column(name = "display_order")
    private int displayOrder = 0;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private List<BikeSpecRow> rows = new ArrayList<>();
}
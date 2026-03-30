package com.mj.backend.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BikeSpecsDTO {

    private Long    id;
    private String  name;
    private String  tagline;
    private String  category;
    private Long    price;
    private String  color;
    private String  image;
    private String  slug;
    private boolean stock;
    private String  specPower;
    private String  specTorque;
    private String  specEngine;

    private List<ColorDTO> colors;
    private List<GroupDTO> groups;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ColorDTO {
        private String hex;
        private String image;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GroupDTO {
        private Long         id;
        private String       title;
        private int          displayOrder;
        private List<RowDTO> rows;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RowDTO {
        private Long   id;
        private String label;
        private String value;
        private int    displayOrder;
    }
}
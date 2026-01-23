package com.example.examcell.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "department")
public class Department {
    @Id
    private int id;
    @Column(name = "departmentname")
    private String departmentName;
    private String abbreviation;

    // bidirectional relationships
    @OneToMany(mappedBy = "department")
    @JsonIgnoreProperties("department")
    private List<CourseOffering> courseOfferings;
}

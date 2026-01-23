package com.example.examcell.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int moduleNo;
    private String moduleName;

    // Foreign key
    @ManyToOne
    @JoinColumn(name = "courseoffering_id")
    private CourseOffering courseOffering;
}

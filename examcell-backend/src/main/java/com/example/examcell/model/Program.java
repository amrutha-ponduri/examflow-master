package com.example.examcell.model;

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
@Table(name = "program")
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "name")
    private String programName;
    @Column(name = "year_of_study")
    private int yearOfStudy;
    @Column(name = "departement")
    private String department;
    @Column(name = "academic_year")
    private String academicYear;
    @Column(name = "semester")
    private int semester;
    @ManyToOne
    @JoinColumn(name = "chief_faculty", nullable = false)
    private User chiefFaculty;
    @ManyToMany
    @JoinTable(name = "program_user",
    joinColumns = @JoinColumn(name = "program_id"),
    inverseJoinColumns = @JoinColumn(name = "username"))
    private List<User> teachingFaculties;
}

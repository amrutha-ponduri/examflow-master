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
@Table(name = "app_user")
public class User {
    @Id
    @Column(name = "username")
    private String userName;
    private String password;
    private String role;
    private String name;

    // many to many
    @ManyToMany
    @JoinTable(name = "courseoffering_user",
    joinColumns = @JoinColumn(name = "username"),
    inverseJoinColumns = @JoinColumn(name = "courseofferings_id"))
    @JsonIgnoreProperties("instructors")
    private List<CourseOffering> courseOfferings;
}

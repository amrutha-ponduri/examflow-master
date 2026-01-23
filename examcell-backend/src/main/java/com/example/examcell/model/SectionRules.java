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
@Table(name = "sectionrules")
public class SectionRules {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "sectionname")
    private String sectionName;
    private int marks;
    @Column(name = "minquestionscount")
    private int minQuestionsCount;

    // Foreign key
    @ManyToOne
    @JoinColumn(name = "regulation")
    private Regulation regulation;
}

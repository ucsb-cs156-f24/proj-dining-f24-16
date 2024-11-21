package edu.ucsb.cs156.dining.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 
 * This is a JPA entity that represents a DiningCommons entry in the Dining Commons database.
 * 
 * A DiningCommons is a dining commons at UCSB.
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "diningcommons")
public class DiningCommons {
  @Id
  private String code;
  private String name;
  private Boolean hasDiningCam;
  private Boolean hasSackMeal;
  private Boolean hasTakeOutMeal;
  private Double latitude;
  private Double longitude;
}
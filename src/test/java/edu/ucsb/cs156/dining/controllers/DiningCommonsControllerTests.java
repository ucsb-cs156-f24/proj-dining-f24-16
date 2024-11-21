package edu.ucsb.cs156.dining.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import edu.ucsb.cs156.dining.ControllerTestCase;
import edu.ucsb.cs156.dining.entities.DiningCommons;
import edu.ucsb.cs156.dining.entities.User;
import edu.ucsb.cs156.dining.repositories.DiningCommonsRepository;
import edu.ucsb.cs156.dining.repositories.UserRepository;
import edu.ucsb.cs156.dining.services.DiningCommonsService;
import edu.ucsb.cs156.dining.testconfig.TestConfig;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = DiningCommonsController.class)
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class DiningCommonsControllerTests extends ControllerTestCase {

  @MockBean DiningCommonsRepository diningCommonsRepository;

  @MockBean UserRepository userRepository;

  @MockBean DiningCommonsService diningCommonsService;

  @Test
  public void api_DiningCommons_all__logged_out__returns_200() throws Exception {
    mockMvc.perform(get("/api/diningcommons/all")).andExpect(status().isOk());
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void api_DiningCommons_all__user_logged_in__returns_200() throws Exception {
    mockMvc.perform(get("/api/diningcommons/all")).andExpect(status().isOk());
  }

  // Tests with mocks for database action : get all dining commons

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void api_todos_admin_all__admin_logged_in__returns_all_records() throws Exception {

    // arrange

    DiningCommons commons1 =
        DiningCommons.builder()
            .name("Carillo Dining")
            .code("carillo")
            .hasDiningCam(true)
            .hasSackMeal(true)
            .hasTakeOutMeal(true)
            .longitude(34.409953)
            .latitude(-119.85277)
            .build();

    DiningCommons commons2 =
        DiningCommons.builder()
            .name("Portola Dining")
            .code("portola")
            .hasDiningCam(false)
            .hasSackMeal(false)
            .hasTakeOutMeal(false)
            .longitude(34.409953)
            .latitude(-119.85277)
            .build();

    DiningCommons commons3 =
        DiningCommons.builder()
            .name("De La Guerra Dining")
            .code("de-la-guerra")
            .hasDiningCam(true)
            .hasSackMeal(false)
            .hasTakeOutMeal(false)
            .longitude(34.409953)
            .latitude(-119.85277)
            .build();

    ArrayList<DiningCommons> expectedCommons = new ArrayList<>();
    expectedCommons.addAll(Arrays.asList(commons1, commons2, commons3));

    when(diningCommonsRepository.findAll()).thenReturn(expectedCommons);

    // act
    MvcResult response =
        mockMvc.perform(get("/api/diningcommons/all")).andExpect(status().isOk()).andReturn();

    // assert

    verify(diningCommonsRepository, times(1)).findAll();
    String expectedJson = mapper.writeValueAsString(expectedCommons);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }
}
package edu.ucsb.cs156.dining.controllers;
import static org.mockito.ArgumentMatchers.eq;
import edu.ucsb.cs156.dining.ControllerTestCase;
import edu.ucsb.cs156.dining.entities.User;
import edu.ucsb.cs156.dining.repositories.UserRepository;
import edu.ucsb.cs156.dining.testconfig.TestConfig;
import edu.ucsb.cs156.dining.models.CurrentUser;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.Arrays;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import java.util.Optional;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.springframework.web.server.ResponseStatusException;



@WebMvcTest(controllers = UsersController.class)
@Import(TestConfig.class)
public class UsersControllerTests extends ControllerTestCase {

  @MockBean
  UserRepository userRepository;

  @Test
  public void users__logged_out() throws Exception {
    mockMvc.perform(get("/api/admin/users"))
        .andExpect(status().is(403));
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void users__user_logged_in() throws Exception {
    mockMvc.perform(get("/api/admin/users"))
        .andExpect(status().is(403));
  }

  @WithMockUser(roles = { "ADMIN", "USER" })
  @Test
  public void users__admin_logged_in() throws Exception {
    // arrange
    User u1 = User.builder().id(1L).build();
    User u2 = User.builder().id(2L).build();
    User u = currentUserService.getCurrentUser().getUser();

    ArrayList<User> expectedUsers = new ArrayList<>();
    expectedUsers.addAll(Arrays.asList(u1, u2, u));

    when(userRepository.findAll()).thenReturn(expectedUsers);
    String expectedJson = mapper.writeValueAsString(expectedUsers);

    // act
    MvcResult response = mockMvc.perform(get("/api/admin/users"))
        .andExpect(status().isOk()).andReturn();

    // assert
    verify(userRepository, times(1)).findAll();
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void a_user_can_post_a_new_alias() throws Exception {
        // arrange
        User currentUser1 = User.builder()
            .id(1L)  
            .email("user@example.org")
            .googleSub("fake_user")
            .pictureUrl("https://example.org/user.jpg")
            .fullName("Fake user")
            .givenName("Fake")
            .familyName("user")
            .emailVerified(true)
            .locale("")
            .hostedDomain("example.org")
            .admin(false)
            .alias(null) 
            .proposedAlias("Chipotle")
            .build();
        
  
        when(userRepository.save(eq(currentUser1))).thenReturn(currentUser1);

        // act
        MvcResult response = mockMvc.perform(
            post("/api/currentUser/updateAlias?proposedAlias=Chipotle") 
                        .with(csrf()))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(userRepository, times(1)).save(currentUser1);
        String expectedJson = mapper.writeValueAsString(currentUser1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }


  @Test
  @WithMockUser(roles = { "ADMIN" })
  public void admin_can_approve_proposed_alias() throws Exception {
    // arrange
    User userOrig = User.builder()
        .id(7L)
        .email("user@example.org")
        .alias("Anonymous User")
        .proposedAlias("Chipotle")
        .build();

    User userEdited = User.builder()
        .id(7L)
        .email("user@example.org")
        .alias("Chipotle")  
        .proposedAlias(null) 
        .build();

    String requestBody = mapper.writeValueAsString(userEdited);
    when(userRepository.findById(7L)).thenReturn(Optional.of(userOrig));

    // act
    MvcResult response = mockMvc.perform(
        put("/api/currentUser/updateAliasModeration")
            .param("id", String.valueOf(7L))
            .param("approved", String.valueOf(true))
            .with(csrf()))
        .andExpect(status().isOk()).andReturn();

    // assert
    verify(userRepository, times(1)).findById(7L);
    verify(userRepository, times(1)).save(userEdited);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(requestBody, responseString);
  }

  @Test
  @WithMockUser(roles = { "ADMIN" })
  public void admin_cannot_approve_nonexistent_user() throws Exception {
    // arrange
    when(userRepository.findById(1L)).thenReturn(Optional.empty());

    // act
    MvcResult response = mockMvc.perform(
        put("/api/currentUser/updateAliasModeration")
            .param("id", String.valueOf(1L))
            .param("approved", String.valueOf(true))
            .with(csrf()))
        .andExpect(status().isNotFound()).andReturn();

    // assert
    verify(userRepository, times(1)).findById(1L);
    Map<String, Object> json = responseToJson(response);
    assertEquals("User with id 1 not found", json.get("message"));
  }

  @Test
  @WithMockUser(roles = { "USER" })
  public void regular_users_cannot_update_alias_moderation() throws Exception {
    mockMvc.perform(post("/api/currentUser/updateAliasModeration"))
        .andExpect(status().is(403));
  }

  @Test
  @WithMockUser(roles = { "USER" })
  public void user_cannot_post_existing_alias() throws Exception {
      User user = User.builder().alias("Chipotle").build();  
      when(userRepository.findByAlias("Chipotle")).thenReturn(Optional.of(user));

      mockMvc.perform(post("/api/currentUser/updateAlias?proposedAlias=Chipotle")
        .with(csrf()))
        .andExpect(status().isBadRequest())
        .andExpect(result -> {
            // Assert that the exception is of type ResponseStatusException
            assertTrue(result.getResolvedException() instanceof ResponseStatusException);

            // Verify the exception message
            ResponseStatusException exception = (ResponseStatusException) result.getResolvedException();
            assertEquals("Alias already in use.", exception.getReason());
        });
  }

  @Test
@WithMockUser(roles = { "ADMIN" })
public void admin_approves_alias() throws Exception {
    // arrange
    User userOrig = User.builder()
        .id(7L)
        .email("user@example.org")
        .alias("Chip")
        .proposedAlias("Chop") 
        .build();

    User userUpdated = User.builder()
        .id(7L)
        .email("user@example.org")
        .alias("Chop")  // Alias should be updated
        .proposedAlias(null)
        .build();

    when(userRepository.findById(7L)).thenReturn(Optional.of(userOrig));

    // act
    MvcResult response = mockMvc.perform(
        put("/api/currentUser/updateAliasModeration")
            .param("id", String.valueOf(7L))
            .param("approved", "true") // Boolean value passed as string
            .with(csrf()))
        .andExpect(status().isOk()).andReturn();

    // assert
    verify(userRepository, times(1)).findById(7L);
    verify(userRepository, times(1)).save(userUpdated);  // Verify the user has been saved with the new alias
    String responseString = response.getResponse().getContentAsString();
    String expectedJson = mapper.writeValueAsString(userUpdated);
    assertEquals(expectedJson, responseString);
}

@Test
@WithMockUser(roles = { "ADMIN" })
public void admin_does_not_approve_alias() throws Exception {
    // arrange
    User userOrig = User.builder()
        .id(7L)
        .email("user@example.org")
        .alias("Chipotle")
        .proposedAlias("Taco Bell")
        .build();

    User userUnchanged = User.builder()
        .id(7L)
        .email("user@example.org")
        .alias("Chipotle") 
        .proposedAlias("Taco Bell")
        .build();

    when(userRepository.findById(7L)).thenReturn(Optional.of(userOrig));

    // act
    MvcResult response = mockMvc.perform(
        put("/api/currentUser/updateAliasModeration")
            .param("id", String.valueOf(7L))
            .param("approved", "false")  // Setting approved as false
            .with(csrf()))
        .andExpect(status().isOk()).andReturn();

    // assert
    verify(userRepository, times(1)).findById(7L);
    verify(userRepository, times(1)).save(userUnchanged);  // User should remain unchanged
    String responseString = response.getResponse().getContentAsString();
    String expectedJson = mapper.writeValueAsString(userUnchanged);
    assertEquals(expectedJson, responseString);
}

}

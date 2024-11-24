// frontend/src/main/components/Review/ReviewForm.js

import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function ReviewForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  // Stryker disable Regex
  const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  const integer_regex = /^[1-9]\d*$/i;
  // Stryker restore Regex

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid="ReviewForm-id"
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="studentId">Student ID</Form.Label>
            <Form.Control
              data-testid="ReviewForm-studentId"
              id="studentId"
              type="text"
              isInvalid={Boolean(errors.studentId)}
              {...register("studentId", {
                required: true,
                pattern: integer_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.studentId && "Student ID is required"}
              {errors.studentId?.type === "pattern" &&
                "Student ID must be a positive integer"}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="itemId">Item ID</Form.Label>
            <Form.Control
              data-testid="ReviewForm-itemId"
              id="itemId"
              type="text"
              isInvalid={Boolean(errors.itemId)}
              {...register("itemId", {
                required: true,
                pattern: integer_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemId && "Item ID is required"}
              {errors.itemId?.type === "pattern" &&
                "Item ID must be a positive integer"}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dateItemServed">Date Item Served</Form.Label>
            <Form.Control
              data-testid="ReviewForm-dateItemServed"
              id="dateItemServed"
              type="datetime-local"
              isInvalid={Boolean(errors.dateItemServed)}
              {...register("dateItemServed", {
                required: true,
                pattern: isodate_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateItemServed && "Date Item Served is required"}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="stars">Stars</Form.Label>
            <Form.Control
              data-testid="ReviewForm-stars"
              id="stars"
              type="number"
              min="1"
              max="5"
              isInvalid={Boolean(errors.stars)}
              {...register("stars", {
                required: true,
                min: 1,
                max: 5,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.stars && "Stars must be between 1 and 5"}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="comments">Comments</Form.Label>
            <Form.Control
              data-testid="ReviewForm-comments"
              id="comments"
              as="textarea"
              rows={3}
              isInvalid={Boolean(errors.comments)}
              {...register("comments", {
                required: true,
                maxLength: 500,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.comments && "Comments are required"}
              {errors.comments?.type === "maxLength" &&
                "Comments cannot exceed 500 characters"}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {initialContents && (
        <>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="status">Status</Form.Label>
                <Form.Control
                  data-testid="ReviewForm-status"
                  id="status"
                  type="text"
                  {...register("status")}
                  value={initialContents.status}
                  disabled
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="userIdModerator">Moderator ID</Form.Label>
                <Form.Control
                  data-testid="ReviewForm-userIdModerator"
                  id="userIdModerator"
                  type="text"
                  {...register("userIdModerator")}
                  value={initialContents.userIdModerator}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="moderatorComments">Moderator Comments</Form.Label>
                <Form.Control
                  data-testid="ReviewForm-moderatorComments"
                  id="moderatorComments"
                  as="textarea"
                  rows={3}
                  {...register("moderatorComments")}
                  value={initialContents.moderatorComments}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="dateCreated">Date Created</Form.Label>
                <Form.Control
                  data-testid="ReviewForm-dateCreated"
                  id="dateCreated"
                  type="text"
                  {...register("dateCreated")}
                  value={initialContents.dateCreated}
                  disabled
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="dateEdited">Date Edited</Form.Label>
                <Form.Control
                  data-testid="ReviewForm-dateEdited"
                  id="dateEdited"
                  type="text"
                  {...register("dateEdited")}
                  value={initialContents.dateEdited}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}

      <Row>
        <Col>
          <Button type="submit" data-testid="ReviewForm-submit">
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid="ReviewForm-cancel"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default ReviewForm;

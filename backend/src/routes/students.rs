use axum::{extract::{Path, State}, http::StatusCode, Json};
use bcrypt::{hash, DEFAULT_COST};
use sqlx::PgPool;

use crate::models::student::{CreateStudent, Student};

pub async fn add_student(
    State(pool): State<PgPool>,
    Json(body): Json<CreateStudent>,
) -> Result<Json<Student>, StatusCode> {
    let password_hash = hash(&body.password, DEFAULT_COST)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let student = sqlx::query_as!(
        Student,
        "INSERT INTO students (name, roll_no, password_hash, class)
         VALUES ($1, $2, $3, 7)
         RETURNING id, name, roll_no, class",
        body.name,
        body.roll_no,
        password_hash
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(student))
}

pub async fn list_students(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Student>>, StatusCode> {
    let students = sqlx::query_as!(
        Student,
        "SELECT id, name, roll_no, class FROM students ORDER BY roll_no"
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(students))
}

pub async fn delete_student(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<StatusCode, StatusCode> {
    sqlx::query!("DELETE FROM students WHERE id = $1", id)
        .execute(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}

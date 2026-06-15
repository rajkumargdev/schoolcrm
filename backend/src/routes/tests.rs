use axum::{extract::{Path, State}, http::StatusCode, Json};
use sqlx::PgPool;

use crate::models::test::{CreateTest, Test};

pub async fn add_test(
    State(pool): State<PgPool>,
    Json(body): Json<CreateTest>,
) -> Result<Json<Test>, StatusCode> {
    let test = sqlx::query_as!(
        Test,
        "INSERT INTO tests (name, test_date, class)
         VALUES ($1, $2, 7)
         RETURNING id, name, test_date, class",
        body.name,
        body.test_date
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(test))
}

pub async fn list_tests(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Test>>, StatusCode> {
    let tests = sqlx::query_as!(
        Test,
        "SELECT id, name, test_date, class FROM tests ORDER BY test_date"
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(tests))
}

pub async fn delete_test(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<StatusCode, StatusCode> {
    sqlx::query!("DELETE FROM tests WHERE id = $1", id)
        .execute(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}

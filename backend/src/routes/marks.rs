use axum::{extract::{Path, State}, http::StatusCode, Json};
use sqlx::PgPool;
use bigdecimal::BigDecimal;

use crate::models::marks::{EnterMark, Mark, MarkWithDetails};

pub async fn enter_marks(
    State(pool): State<PgPool>,
    Json(body): Json<EnterMark>,
) -> Result<Json<Mark>, StatusCode> {
    let mark = sqlx::query_as!(
        Mark,
        "INSERT INTO marks (student_id, test_id, subject_id, score, max_score)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, student_id, test_id, subject_id, score, max_score",
        body.student_id,
        body.test_id,
        body.subject_id,
        body.score as BigDecimal,
        body.max_score as BigDecimal
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(mark))
}

pub async fn student_marks(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<Json<Vec<MarkWithDetails>>, StatusCode> {
    let marks = sqlx::query_as!(
        MarkWithDetails,
        "SELECT s.name as subject_name, t.name as test_name,
                m.score as \"score: BigDecimal\", m.max_score as \"max_score: BigDecimal\"
         FROM marks m
         JOIN subjects s ON s.id = m.subject_id
         JOIN tests t    ON t.id = m.test_id
         WHERE m.student_id = $1
         ORDER BY t.test_date, s.name",
        id
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(marks))
}

pub async fn test_report(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<Json<Vec<MarkWithDetails>>, StatusCode> {
    let marks = sqlx::query_as!(
        MarkWithDetails,
        "SELECT s.name as subject_name, t.name as test_name,
                m.score as \"score: BigDecimal\", m.max_score as \"max_score: BigDecimal\"
         FROM marks m
         JOIN subjects s ON s.id = m.subject_id
         JOIN tests t    ON t.id = m.test_id
         WHERE m.test_id = $1
         ORDER BY m.student_id, s.name",
        id
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(marks))
}

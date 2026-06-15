use serde::{Deserialize, Serialize};
use bigdecimal::BigDecimal;

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct Mark {
    pub id: i32,
    pub student_id: i32,
    pub test_id: i32,
    pub subject_id: i32,
    pub score: BigDecimal,
    pub max_score: BigDecimal,
}

#[derive(Deserialize)]
pub struct EnterMark {
    pub student_id: i32,
    pub test_id: i32,
    pub subject_id: i32,
    pub score: BigDecimal,
    pub max_score: BigDecimal,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct MarkWithDetails {
    pub subject_name: String,
    pub test_name: String,
    pub score: BigDecimal,
    pub max_score: BigDecimal,
}

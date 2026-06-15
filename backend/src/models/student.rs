use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct Student {
    pub id: i32,
    pub name: String,
    pub roll_no: String,
    pub class: i32,
}

#[derive(Deserialize)]
pub struct CreateStudent {
    pub name: String,
    pub roll_no: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub roll_no: String,
    pub password: String,
}

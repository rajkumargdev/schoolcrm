use axum::{extract::State, http::StatusCode, Json};
use bcrypt::verify;
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::models::teacher::LoginRequest as TeacherLogin;
use crate::models::student::LoginRequest as StudentLogin;

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub role: String,
    pub id: i32,
    pub exp: usize,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub name: String,
    pub role: String,
}

pub async fn teacher_login(
    State(pool): State<PgPool>,
    Json(body): Json<TeacherLogin>,
) -> Result<Json<AuthResponse>, StatusCode> {
    let teacher = sqlx::query!(
        "SELECT id, name, password_hash FROM teachers WHERE username = $1",
        body.username
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    println!("password: {}", &body.password);
    println!("hash: {}", &teacher.password_hash);

    let valid = verify(&body.password, &teacher.password_hash)
        .map_err(|e| {
            println!("bcrypt error: {:?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    println!("valid: {}", valid);

    if !valid {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let token = create_token(teacher.id, "teacher".to_string());

    Ok(Json(AuthResponse {
        token,
        name: teacher.name,
        role: "teacher".to_string(),
    }))
}

pub async fn student_login(
    State(pool): State<PgPool>,
    Json(body): Json<StudentLogin>,
) -> Result<Json<AuthResponse>, StatusCode> {
    let student = sqlx::query!(
        "SELECT id, name, password_hash FROM students WHERE roll_no = $1",
        body.roll_no
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    let valid = verify(&body.password, &student.password_hash)
        .map_err(|e| {
            println!("bcrypt error: {:?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    if !valid {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let token = create_token(student.id, "student".to_string());

    Ok(Json(AuthResponse {
        token,
        name: student.name,
        role: "student".to_string(),
    }))
}

fn create_token(id: i32, role: String) -> String {
    let secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    let claims = Claims {
        sub: id.to_string(),
        role,
        id,
        exp: 10000000000,
    };
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .unwrap()
}

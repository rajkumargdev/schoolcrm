mod db;
mod models;
mod routes;

use axum::{
    Router,
    routing::{post, get, delete},
};
use tower_http::cors::CorsLayer;
use dotenv::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let pool = db::create_pool().await;
    println!("✅ Connected to PostgreSQL");

    let app = Router::new()
        .route("/auth/teacher/login", post(routes::auth::teacher_login))
        .route("/auth/student/login", post(routes::auth::student_login))
        .route("/students", post(routes::students::add_student))
        .route("/students", get(routes::students::list_students))
        .route("/students/:id", delete(routes::students::delete_student))
        .route("/tests", post(routes::tests::add_test))
        .route("/tests", get(routes::tests::list_tests))
        .route("/tests/:id", delete(routes::tests::delete_test))
        .route("/marks", post(routes::marks::enter_marks))
        .route("/marks/student/:id", get(routes::marks::student_marks))
        .route("/marks/test/:id", get(routes::marks::test_report))
        .layer(CorsLayer::permissive())
        .with_state(pool);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("🚀 Server running on http://0.0.0.0:8080");
    axum::serve(listener, app).await.unwrap();
}

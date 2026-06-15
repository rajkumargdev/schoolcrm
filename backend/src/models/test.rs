use serde::{Deserialize, Serialize};
use chrono::NaiveDate;

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct Test {
    pub id: i32,
    pub name: String,
    pub test_date: NaiveDate,
    pub class: i32,
}

#[derive(Deserialize)]
pub struct CreateTest {
    pub name: String,
    pub test_date: NaiveDate,
}

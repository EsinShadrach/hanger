use std::env;

use axum::{routing::get, Json, Router};
use dotenv::dotenv;
use serde::Serialize;

use tokio::net::TcpListener;

enum Keys {
    DatabaseUrl,
}

impl Keys {
    fn as_str(&self) -> &'static str {
        match self {
            Keys::DatabaseUrl => "TURSO_DATABASE_URL",
        }
    }
}

#[derive(Serialize)]
struct WelcomeMessage {
    message: String,
}

async fn root() -> Json<WelcomeMessage> {
    return Json(WelcomeMessage {
        message: "Hello World".to_string(),
    });
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    let db_env_key = Keys::DatabaseUrl.as_str();
    let _db_env =
        env::var(db_env_key).expect(format!("{db_env_key} must be set").to_string().as_str());

    tracing_subscriber::fmt::init();

    tracing::info!("Starting server...");

    let app = Router::new()
        .route("/", get(root))
        .route("/users", get(users));

    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tracing::info!("Server running at http://{}/", addr);
    axum::serve(listener, app).await.unwrap();
}

#[derive(Serialize)]
struct User {
    name: String,
    age: i32,
}

async fn users() -> Json<Vec<User>> {
    tracing::info!("Requested Users");

    return Json(vec![
        User {
            name: "Alice".to_string(),
            age: 30,
        },
        User {
            name: "Bob".to_string(),
            age: 40,
        },
    ]);
}

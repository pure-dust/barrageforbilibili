use std::{collections::HashMap, str::FromStr};

use reqwest::header::{HeaderMap, HeaderName};
use serde_json::{self, Value};

#[tauri::command]
pub async fn request(
    method: String,
    url: String,
    params: HashMap<String, Value>,
    headers: HashMap<String, String>,
) -> HashMap<String, Value> {
    let mut _headers = HeaderMap::new();
    for (k, v) in headers {
        _headers.insert(
            HeaderName::from_str(&k.to_string()).unwrap(),
            v.parse().unwrap(),
        );
    }
    let response = match method.to_uppercase().as_str() {
        "GET" => get(url, params, _headers).await,
        "POST" => post(url, params, _headers).await,
        _ => get(url, params, _headers).await,
    };
    match response {
        Ok(r) => r,
        Err(_) => HashMap::new(),
    }
}

async fn get(
    url: String,
    params: HashMap<String, Value>,
    headers: HeaderMap,
) -> Result<HashMap<String, Value>, reqwest::Error> {
    let client = reqwest::Client::new();
    let mut query = vec![];
    for (k, v) in params {
        query.push((k, v))
    }
    Ok(client
        .get(url)
        .query(&query)
        .headers(headers)
        .send()
        .await?
        .json::<HashMap<String, Value>>()
        .await?)
}

async fn post(
    url: String,
    params: HashMap<String, Value>,
    headers: HeaderMap,
) -> Result<HashMap<String, Value>, reqwest::Error> {
    let client = reqwest::Client::new();

    Ok(client
        .post(url)
        .json(&params)
        .headers(headers)
        .send()
        .await?
        .json::<HashMap<String, Value>>()
        .await?)
}

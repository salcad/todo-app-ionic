import API from "../api"
import authHeader from "./authHeader";
const mode: RequestMode = "cors"

export function GET(
  endpoint: string 
) {
  const headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', authHeader());

  return fetch(
    `${API}/${endpoint}`,
    {
      method: 'GET',
      headers,
    }
  )
}

export function POST(
  endpoint: string,
  body: any,
  isWithoutToken?: boolean,
) {
  const headers: any = {
    "Content-Type": "application/json",
  }

  if (!isWithoutToken) {
    headers["Authorization"] = authHeader();
  }
  
  const options = {
    method: "POST",
    mode,
    headers: headers,
    body: JSON.stringify(body),
  }
  return fetch(`${API}/${endpoint}`, options)
}

export function PUT(
  endpoint: string,
  body: any
) {
  const headers: any = {
    "Content-Type": "application/json",
  }

  headers["Authorization"] = authHeader();

  const options = {
    method: "PUT",
    mode,
    headers: headers,
    body: JSON.stringify(body),
  }
  return fetch(`${API}/${endpoint}`, options)
}

export function DELETE(
  endpoint: string,
) {
  const headers: any = {}

  headers["Authorization"] = authHeader();

  const options: any = {
    method: "DELETE",
    mode,
    headers: headers,
  }

  return fetch(`${API}/${endpoint}`, options)
}

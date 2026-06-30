export const getUsers = async () => {
  const baseUrl = "http://localhost:3005/user";

  try {
    const res = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok)
      return { message: "Something went wrong. Try again later", data: null };

    const data = await res.json();

    return { message: "success", data };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Try again later", data: null };
  }
};
import RouteError from "../types/RouteError";
export default async function getHostVans(hostId: string) {
  const fetchString = `/hosts/${hostId}/vans`;
  return fetch(fetchString).then((res) => {
    if (!res.ok) {
      throw {
        message: "Unable to Load Host Vans",
        status: res.status,
        statusText: res.statusText,
      } as RouteError;
    }
    return res.json();
  });
}

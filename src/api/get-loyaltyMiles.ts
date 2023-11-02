import axios from "axios";

export async function getloyaltyMiles(accessToken: string, num: string) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await getApiInstance().get(`/GetLoyaltyMiles/${num}`, {
    headers: headers,
  });
  return response ;
  
}

export const getApiInstance = () => {
  return axios.create({ baseURL: window.config.choreoApiUrl });
};

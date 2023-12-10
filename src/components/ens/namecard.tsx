import { Avatar } from "@mui/material";

export const EnsNameCard = ({ name, avatar }: any) => {
  console.log(avatar);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <Avatar
        src={avatar || "https://i.imgur.com/UhV7H97.jpeg"}
        style={{ width: "2rem", height: "2rem", objectFit: "cover" }}
      />
      <span>{name}</span>
    </div>
  );
};

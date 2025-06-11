import { Avatar, Typography } from "@mui/material";
import React, { memo } from "react";

type AppLogoVariant = {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  mb?: string;
  mr?: string;
  modal?: boolean;
  iconHeight?: number;
  iconWidth?: number;
};

const AppLogo: React.FC<AppLogoVariant> = memo(
  ({
    variant,
    mb,
    mr = "10px",
    modal = false,
    iconHeight = 32,
    iconWidth = 32,
  }) => {
    return (
      <>
        <Avatar
          src={"icons/logo.svg"}
          sx={{
            marginRight: mr,
            userDrag: "none",
            height: `${iconHeight}px`,
            width: `${iconWidth}px`,
            transition: "1000ms ease-in-out",
          }}
        />
        <Typography
          variant={variant}
          component="div"
          sx={{
            display: { xs: "none", sm: "inherit" },
            marginRight: mr,
            fontFamily: "AdventPro",
            fontWeight: 600,
            marginBottom: mb,
            userSelect: "none",
          }}
        >
          Телефония
        </Typography>
      </>
    );
  }
);

export default AppLogo;

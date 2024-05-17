"use client";

import { getUserDetail } from "@/app/api/login-api/accessToken";
import { useEffect, useState } from "react";

const UserDetail = () => {
  const [userDetail, setUserDetail] = useState({ fName: "", lName: "" });

  useEffect(() => {
    const fetchUserDetail = async () => {
      const userDetail = await getUserDetail();
      setUserDetail(userDetail);
    };
    fetchUserDetail();
  }, []);

  return (
    <>
      {userDetail.fName} {userDetail.lName}
    </>
  );
};

export default UserDetail;

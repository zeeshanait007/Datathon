-- Zoho Catalyst Data Store ER Schema (27 Tables)

CREATE TABLE "Act" (
	"ActCode" VARCHAR NOT NULL, 
	"ActDescription" VARCHAR, 
	"ShortName" VARCHAR, 
	"Active" BOOLEAN, 
	PRIMARY KEY ("ActCode")
);

CREATE TABLE "CaseCategory" (
	"CaseCategoryID" INTEGER NOT NULL, 
	"LookupValue" VARCHAR, 
	PRIMARY KEY ("CaseCategoryID")
);

CREATE TABLE "CaseStatusMaster" (
	"CaseStatusID" INTEGER NOT NULL, 
	"CaseStatusName" VARCHAR, 
	PRIMARY KEY ("CaseStatusID")
);

CREATE TABLE "CasteMaster" (
	caste_master_id INTEGER NOT NULL, 
	caste_master_name VARCHAR, 
	PRIMARY KEY (caste_master_id)
);

CREATE TABLE "CrimeHead" (
	"CrimeHeadID" INTEGER NOT NULL, 
	"CrimeGroupName" VARCHAR, 
	"Active" BOOLEAN, 
	PRIMARY KEY ("CrimeHeadID")
);

CREATE TABLE "Designation" (
	"DesignationID" INTEGER NOT NULL, 
	"DesignationName" VARCHAR, 
	"Active" BOOLEAN, 
	"SortOrder" INTEGER, 
	PRIMARY KEY ("DesignationID")
);

CREATE TABLE "GravityOffence" (
	"GravityOffenceID" INTEGER NOT NULL, 
	"LookupValue" VARCHAR, 
	PRIMARY KEY ("GravityOffenceID")
);

CREATE TABLE "OccupationMaster" (
	"OccupationID" INTEGER NOT NULL, 
	"OccupationName" VARCHAR, 
	PRIMARY KEY ("OccupationID")
);

CREATE TABLE "Rank" (
	"RankID" INTEGER NOT NULL, 
	"RankName" VARCHAR, 
	"Hierarchy" INTEGER, 
	"Active" BOOLEAN, 
	PRIMARY KEY ("RankID")
);

CREATE TABLE "ReligionMaster" (
	"ReligionID" INTEGER NOT NULL, 
	"ReligionName" VARCHAR, 
	PRIMARY KEY ("ReligionID")
);

CREATE TABLE "State" (
	"StateID" INTEGER NOT NULL, 
	"StateName" VARCHAR, 
	"NationalityID" INTEGER, 
	"Active" BOOLEAN, 
	PRIMARY KEY ("StateID")
);

CREATE TABLE "UnitType" (
	"UnitTypeID" INTEGER NOT NULL, 
	"UnitTypeName" VARCHAR, 
	"CityDistState" VARCHAR, 
	"Hierarchy" INTEGER, 
	"Active" BOOLEAN, 
	PRIMARY KEY ("UnitTypeID")
);

CREATE TABLE "CrimeHeadActSection" (
	id INTEGER NOT NULL, 
	"CrimeHeadID" INTEGER, 
	"ActCode" VARCHAR, 
	"SectionCode" VARCHAR, 
	PRIMARY KEY (id), 
	FOREIGN KEY("CrimeHeadID") REFERENCES "CrimeHead" ("CrimeHeadID"), 
	FOREIGN KEY("ActCode") REFERENCES "Act" ("ActCode")
);

CREATE TABLE "CrimeSubHead" (
	"CrimeSubHeadID" INTEGER NOT NULL, 
	"CrimeHeadID" INTEGER, 
	"CrimeHeadName" VARCHAR, 
	"SeqID" INTEGER, 
	PRIMARY KEY ("CrimeSubHeadID"), 
	FOREIGN KEY("CrimeHeadID") REFERENCES "CrimeHead" ("CrimeHeadID")
);

CREATE TABLE "District" (
	"DistrictID" INTEGER NOT NULL, 
	"DistrictName" VARCHAR, 
	"StateID" INTEGER, 
	"Active" BOOLEAN, 
	PRIMARY KEY ("DistrictID"), 
	FOREIGN KEY("StateID") REFERENCES "State" ("StateID")
);

CREATE TABLE "Section" (
	"SectionCode" VARCHAR NOT NULL, 
	"ActCode" VARCHAR, 
	"SectionDescription" VARCHAR, 
	"Active" BOOLEAN, 
	PRIMARY KEY ("SectionCode"), 
	FOREIGN KEY("ActCode") REFERENCES "Act" ("ActCode")
);

CREATE TABLE "Court" (
	"CourtID" INTEGER NOT NULL, 
	"CourtName" VARCHAR, 
	"DistrictID" INTEGER, 
	"StateID" INTEGER, 
	"Active" BOOLEAN, 
	PRIMARY KEY ("CourtID"), 
	FOREIGN KEY("DistrictID") REFERENCES "District" ("DistrictID"), 
	FOREIGN KEY("StateID") REFERENCES "State" ("StateID")
);

CREATE TABLE "Unit" (
	"UnitID" INTEGER NOT NULL, 
	"UnitName" VARCHAR, 
	"TypeID" INTEGER, 
	"ParentUnit" INTEGER, 
	"NationalityID" INTEGER, 
	"StateID" INTEGER, 
	"DistrictID" INTEGER, 
	"Active" BOOLEAN, 
	PRIMARY KEY ("UnitID"), 
	FOREIGN KEY("TypeID") REFERENCES "UnitType" ("UnitTypeID"), 
	FOREIGN KEY("StateID") REFERENCES "State" ("StateID"), 
	FOREIGN KEY("DistrictID") REFERENCES "District" ("DistrictID")
);

CREATE TABLE "Employee" (
	"EmployeeID" INTEGER NOT NULL, 
	"DistrictID" INTEGER, 
	"UnitID" INTEGER, 
	"RankID" INTEGER, 
	"DesignationID" INTEGER, 
	"KGID" VARCHAR, 
	"FirstName" VARCHAR, 
	"EmployeeDOB" DATE, 
	"GenderID" INTEGER, 
	"BloodGroupID" INTEGER, 
	"PhysicallyChallenged" BOOLEAN, 
	"AppointmentDate" DATE, 
	PRIMARY KEY ("EmployeeID"), 
	FOREIGN KEY("DistrictID") REFERENCES "District" ("DistrictID"), 
	FOREIGN KEY("UnitID") REFERENCES "Unit" ("UnitID"), 
	FOREIGN KEY("RankID") REFERENCES "Rank" ("RankID"), 
	FOREIGN KEY("DesignationID") REFERENCES "Designation" ("DesignationID")
);

CREATE TABLE "CaseMaster" (
	"CaseMasterID" INTEGER NOT NULL, 
	"CrimeNo" VARCHAR, 
	"CaseNo" VARCHAR, 
	"CrimeRegisteredDate" DATE, 
	"PolicePersonID" INTEGER, 
	"PoliceStationID" INTEGER, 
	"CaseCategoryID" INTEGER, 
	"GravityOffenceID" INTEGER, 
	"CrimeMajorHeadID" INTEGER, 
	"CrimeMinorHeadID" INTEGER, 
	"CaseStatusID" INTEGER, 
	"CourtID" INTEGER, 
	PRIMARY KEY ("CaseMasterID"), 
	FOREIGN KEY("PolicePersonID") REFERENCES "Employee" ("EmployeeID"), 
	FOREIGN KEY("PoliceStationID") REFERENCES "Unit" ("UnitID"), 
	FOREIGN KEY("CaseCategoryID") REFERENCES "CaseCategory" ("CaseCategoryID"), 
	FOREIGN KEY("GravityOffenceID") REFERENCES "GravityOffence" ("GravityOffenceID"), 
	FOREIGN KEY("CrimeMajorHeadID") REFERENCES "CrimeHead" ("CrimeHeadID"), 
	FOREIGN KEY("CrimeMinorHeadID") REFERENCES "CrimeSubHead" ("CrimeSubHeadID"), 
	FOREIGN KEY("CaseStatusID") REFERENCES "CaseStatusMaster" ("CaseStatusID"), 
	FOREIGN KEY("CourtID") REFERENCES "Court" ("CourtID")
);

CREATE TABLE "Accused" (
	"AccusedMasterID" INTEGER NOT NULL, 
	"CaseMasterID" INTEGER, 
	"AccusedName" VARCHAR, 
	"AgeYear" INTEGER, 
	"GenderID" INTEGER, 
	"PersonID" VARCHAR, 
	PRIMARY KEY ("AccusedMasterID"), 
	FOREIGN KEY("CaseMasterID") REFERENCES "CaseMaster" ("CaseMasterID")
);

CREATE TABLE "ActSectionAssociation" (
	id INTEGER NOT NULL, 
	"CaseMasterID" INTEGER, 
	"ActID" VARCHAR, 
	"SectionID" VARCHAR, 
	"ActOrderID" INTEGER, 
	"SectionOrderID" INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY("CaseMasterID") REFERENCES "CaseMaster" ("CaseMasterID"), 
	FOREIGN KEY("ActID") REFERENCES "Act" ("ActCode"), 
	FOREIGN KEY("SectionID") REFERENCES "Section" ("SectionCode")
);

CREATE TABLE "ChargesheetDetails" (
	"CSID" INTEGER NOT NULL, 
	"CaseMasterID" INTEGER, 
	csdate DATETIME, 
	cstype CHAR, 
	"PolicePersonID" INTEGER, 
	PRIMARY KEY ("CSID"), 
	FOREIGN KEY("CaseMasterID") REFERENCES "CaseMaster" ("CaseMasterID"), 
	FOREIGN KEY("PolicePersonID") REFERENCES "Employee" ("EmployeeID")
);

CREATE TABLE "ComplainantDetails" (
	"ComplainantID" INTEGER NOT NULL, 
	"CaseMasterID" INTEGER, 
	"ComplainantName" VARCHAR, 
	"AgeYear" INTEGER, 
	"OccupationID" INTEGER, 
	"ReligionID" INTEGER, 
	"CasteID" INTEGER, 
	"GenderID" INTEGER, 
	PRIMARY KEY ("ComplainantID"), 
	FOREIGN KEY("CaseMasterID") REFERENCES "CaseMaster" ("CaseMasterID"), 
	FOREIGN KEY("OccupationID") REFERENCES "OccupationMaster" ("OccupationID"), 
	FOREIGN KEY("ReligionID") REFERENCES "ReligionMaster" ("ReligionID"), 
	FOREIGN KEY("CasteID") REFERENCES "CasteMaster" (caste_master_id)
);

CREATE TABLE "Inv_OccuranceTime" (
	id INTEGER NOT NULL, 
	"CaseMasterID" INTEGER, 
	"IncidentFromDate" DATETIME, 
	"IncidentToDate" DATETIME, 
	"InfoReceivedPSDate" DATETIME, 
	latitude FLOAT, 
	longitude FLOAT, 
	"BriefFacts" TEXT, 
	PRIMARY KEY (id), 
	FOREIGN KEY("CaseMasterID") REFERENCES "CaseMaster" ("CaseMasterID")
);

CREATE TABLE "Victim" (
	"VictimMasterID" INTEGER NOT NULL, 
	"CaseMasterID" INTEGER, 
	"VictimName" VARCHAR, 
	"AgeYear" INTEGER, 
	"GenderID" INTEGER, 
	"VictimPolice" VARCHAR, 
	PRIMARY KEY ("VictimMasterID"), 
	FOREIGN KEY("CaseMasterID") REFERENCES "CaseMaster" ("CaseMasterID")
);

CREATE TABLE "ArrestSurrender" (
	"ArrestSurrenderID" INTEGER NOT NULL, 
	"CaseMasterID" INTEGER, 
	"ArrestSurrenderTypeID" INTEGER, 
	"ArrestSurrenderDate" DATE, 
	"ArrestSurrenderStateId" INTEGER, 
	"ArrestSurrenderDistrictId" INTEGER, 
	"PoliceStationID" INTEGER, 
	"IOID" INTEGER, 
	"CourtID" INTEGER, 
	"AccusedMasterID" INTEGER, 
	"IsAccused" BOOLEAN, 
	"IsComplainantAccused" BOOLEAN, 
	PRIMARY KEY ("ArrestSurrenderID"), 
	FOREIGN KEY("CaseMasterID") REFERENCES "CaseMaster" ("CaseMasterID"), 
	FOREIGN KEY("ArrestSurrenderStateId") REFERENCES "State" ("StateID"), 
	FOREIGN KEY("ArrestSurrenderDistrictId") REFERENCES "District" ("DistrictID"), 
	FOREIGN KEY("PoliceStationID") REFERENCES "Unit" ("UnitID"), 
	FOREIGN KEY("IOID") REFERENCES "Employee" ("EmployeeID"), 
	FOREIGN KEY("CourtID") REFERENCES "Court" ("CourtID"), 
	FOREIGN KEY("AccusedMasterID") REFERENCES "Accused" ("AccusedMasterID")
);


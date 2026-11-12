export interface LocationItem {
  id: string;
  name: string;
  nameBn: string | null;
}

export interface Division extends LocationItem {}

export interface District extends LocationItem {
  divisionId: string;
}

export interface Upazila extends LocationItem {
  districtId: string;
}

export interface Union extends LocationItem {
  upazilaId: string;
}

export interface Pourashava extends LocationItem {
  upazilaId: string;
}

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { API_BASE_URL } from "../services/api";

interface DoctorAddress {
  city: string;
  phone: string;
  postal_code: string;
  state: string;
  street: string;
}

interface Doctor {
  address: DoctorAddress;
  name: string;
  npi: string;
  organization: string | null;
  specialty: string;
}

interface ApiResponse {
  count: number;
  location_searched: string;
  results: Doctor[];
  success: boolean;
  error?: string;
}

const ITEMS_PER_PAGE = 4;

export function NearbyDoctors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("27523"); // Default ZIP code
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchDoctors = async (location: string) => {
    if (!location.trim()) {
      setError("Please enter a location (ZIP code or city)");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/search_cardiologists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: location.trim(), radius: 30 }),
      });
      const data: ApiResponse = await res.json();
      if (data.success) {
        setDoctors(data.results);
        setHasSearched(true);
      } else {
        setError(data.error || "Failed to fetch cardiologists");
      }
    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = () => {
    fetchDoctors(locationQuery);
  };

  const getDisplayName = (doctor: Doctor) => {
    if (doctor.name && doctor.name.trim()) {
      return doctor.name;
    }
    if (doctor.organization) {
      return doctor.organization;
    }
    return "No doctor name";
  };

  const formatPhone = (phone: string) => {
    // Format as (XXX) XXX-XXXX if it's 10 digits
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const formatAddress = (address: DoctorAddress) => {
    return `${address.street}, ${address.city}, ${address.state}`;
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const name = getDisplayName(doctor).toLowerCase();
    const specialty = doctor.specialty.toLowerCase();
    const city = doctor.address.city.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      name.includes(query) || specialty.includes(query) || city.includes(query)
    );
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
      <div className="flex items-center gap-3 mb-3">
        <MapPin className="w-8 h-8 text-[#1C6DD0]" />
        <h2 className="text-[#1a202c]">Nearby Cardiologists</h2>
      </div>
      <p className="text-[#718096] mb-8">
        Top-rated heart specialists in your area, ready to help you
      </p>

      {/* Location Search */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 flex items-center border-2 border-[#1C6DD0] rounded-2xl bg-white focus-within:border-[#1557a8] overflow-hidden">
          <MapPin className="ml-4 w-5 h-5 text-[#718096] shrink-0" />
          <Input
            type="text"
            placeholder="Enter ZIP code or city..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLocationSearch()}
            className="w-full border-0 py-4 text-base bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          onClick={handleLocationSearch}
          disabled={loading}
          className="bg-[#1C6DD0] hover:bg-[#1557a8] text-white rounded-2xl px-8"
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Filter Search Bar */}
      {hasSearched && doctors.length > 0 && (
        <div className="relative mb-8 flex items-center border-2 border-[#E8F4FF] rounded-2xl bg-white focus-within:border-[#1C6DD0] overflow-hidden">
          <Search className="ml-4 w-5 h-5 text-[#718096] shrink-0" />
          <Input
            type="text"
            placeholder="Filter by name, specialty, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-0 py-4 text-base bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      )}

      {!hasSearched && !loading && !error && (
        <div className="text-center py-12 text-[#718096]">
          Enter your ZIP code or city above to find cardiologists near you.
        </div>
      )}

      {loading && (
        <div className="text-center py-12 text-[#718096]">
          Searching for cardiologists...
        </div>
      )}

      {error && <div className="text-center py-12 text-red-500">{error}</div>}

      {!loading && !error && hasSearched && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedDoctors.map((doctor) => (
              <div
                key={doctor.npi}
                className="bg-gradient-to-br from-[#E8F4FF] to-white p-6 rounded-2xl border-2 border-[#E8F4FF] hover:border-[#1C6DD0] transition-all hover:shadow-lg"
              >
                <div className="flex flex-col gap-4">
                  {/* Doctor Icon and Basic Info */}
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-[#1C6DD0]/10 border-2 border-[#1C6DD0] shrink-0 flex items-center justify-center">
                      <User className="w-10 h-10 text-[#1C6DD0]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[#1a202c] font-semibold mb-1 truncate">
                        {getDisplayName(doctor)}
                      </h4>
                      <p className="text-sm text-[#1C6DD0] font-medium mb-2">
                        {doctor.specialty}
                      </p>
                      {doctor.organization && doctor.name && (
                        <p className="text-xs text-[#718096] truncate">
                          {doctor.organization}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Info and Action */}
                  <div className="flex flex-col gap-3">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-[#718096]">
                        <MapPin className="w-4 h-4 text-[#1C6DD0] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {formatAddress(doctor.address)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#718096]">
                        <Phone className="w-4 h-4 text-[#1C6DD0] shrink-0" />
                        <span>{formatPhone(doctor.address.phone)}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-[#1C6DD0] hover:bg-[#1557a8] text-white rounded-xl px-6"
                    >
                      Contact via listed phone
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No results */}
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12 text-[#718096]">
              No cardiologists found matching your search.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-[#1C6DD0] text-[#1C6DD0] hover:bg-[#E8F4FF] disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className={
                      page === currentPage
                        ? "bg-[#1C6DD0] text-white"
                        : "border-[#1C6DD0] text-[#1C6DD0] hover:bg-[#E8F4FF]"
                    }
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-[#1C6DD0] text-[#1C6DD0] hover:bg-[#E8F4FF] disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Results count */}
          {filteredDoctors.length > 0 && (
            <p className="text-center text-sm text-[#718096] mt-4">
              Showing {startIndex + 1}-
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredDoctors.length)} of{" "}
              {filteredDoctors.length} cardiologists
            </p>
          )}
        </>
      )}
    </div>
  );
}

provider "google" {
  project     = "expanded-rider-445003-j0"
  region      = "asia-southeast1"
  credentials = file("expanded-rider-445003-j0-076894048edd.json")
}

resource "google_compute_instance" "vm_instance" {
  name         = "parcel-tracking-vm"
  machine_type = "e2-medium"
  zone         = "asia-southeast1-a"

  boot_disk {
    initialize_params {
      # ใช้ image ที่ต้องการ
      image = "ubuntu-2004-lts"  # หรือระบุ image ที่ต้องการใน format ของ image family
      size  = 20
      type  = "pd-ssd"
    }
  }

  network_interface {
    network = "default"
    access_config {
      // ให้ External IP
    }
  }
}

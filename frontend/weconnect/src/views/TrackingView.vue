```vue
<template>
  <!-- Main WeConnect delivery tracking page -->
  <div
    class="connect-tracking-page"
    style="
      min-height: 100vh;
      background: #E8E2DD;
      color: #5C3D24;
      padding: 32px;
      box-sizing: border-box;
    "
  >

    <!-- Page heading -->
    <div
      class="connect-tracking-header"
      style="
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 24px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      "
    >

      <div>
        <!-- Small label above the main heading -->
        <div
          class="connect-tracking-label"
          style="
            color: #D17A4A;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 7px;
          "
        >
          LIVE DELIVERY
        </div>

        <!-- Main page heading -->
        <h1
          class="connect-tracking-title"
          style="
            margin: 0;
            color: #4E342E;
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 38px;
            line-height: 1.1;
            font-weight: 600;
          "
        >
          Delivery Tracking
        </h1>

        <!-- Short page description -->
        <p
          class="connect-tracking-description"
          style="
            margin: 9px 0 0;
            color: #7A6A61;
            font-size: 15px;
            line-height: 1.5;
          "
        >
          Follow your delivery's journey in real time.
        </p>
      </div>

      <!-- Order identification -->
      <div
        class="connect-tracking-order-badge"
        style="
          background: #FFFEFC;
          border: 1px solid rgba(92, 61, 36, 0.10);
          border-radius: 12px;
          padding: 11px 16px;
          box-shadow: 0 4px 14px rgba(78, 52, 46, 0.05);
        "
      >
        <div
          style="
            color: #9A8B82;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 3px;
          "
        >
          ORDER
        </div>

        <div
          style="
            color: #4E342E;
            font-size: 15px;
            font-weight: 700;
          "
        >
          #ORD-001
        </div>
      </div>

    </div>


    <!-- Main tracking card -->
    <div
      class="connect-tracking-main-card"
      style="
        background: #FFFEFC;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(78, 52, 46, 0.08);
        border: 1px solid rgba(92, 61, 36, 0.08);
      "
    >

      <!-- Map header -->
      <div
        class="connect-tracking-map-header"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 22px;
          border-bottom: 1px solid rgba(92, 61, 36, 0.08);
          gap: 16px;
          flex-wrap: wrap;
        "
      >

        <div>
          <div
            style="
              color: #4E342E;
              font-size: 17px;
              font-weight: 700;
            "
          >
            Live Location
          </div>

          <div
            style="
              color: #9A8B82;
              font-size: 13px;
              margin-top: 3px;
            "
          >
            Your delivery is currently on the road
          </div>
        </div>

        <!-- Live status indicator -->
        <div
          class="connect-tracking-live-status"
          style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #F1F6F1;
            color: #47704A;
            border-radius: 999px;
            padding: 8px 13px;
            font-size: 12px;
            font-weight: 700;
          "
        >
          <!-- Small live indicator -->
          <span
            style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #5C8A60;
              display: inline-block;
            "
          ></span>

          Tracking Active
        </div>

      </div>


      <!-- Map area -->
      <!-- Keeps the square map visually centred inside the tracking card -->
       <div
       class="connect-tracking-map-wrapper"
       style="
       position: relative;
       width: 100%;
       background: #E8E2DD;
       padding: 18px;
       box-sizing: border-box;
      "
>

        <!-- Interactive Leaflet map -->
        <TrackingMap />

        <!-- Floating delivery status card -->
        <div
          class="connect-tracking-floating-card"
          style="
            position: absolute;
            top: 18px;
            left: 18px;
            z-index: 500;
            width: 210px;
            background: rgba(255, 254, 252, 0.96);
            backdrop-filter: blur(8px);
            border-radius: 14px;
            padding: 14px;
            box-shadow: 0 8px 25px rgba(78, 52, 46, 0.16);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-sizing: border-box;
          "
        >

          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 10px;
            "
          >

            <!-- Delivery icon -->
            <div
              style="
                width: 34px;
                height: 34px;
                border-radius: 10px;
                background: #D17A4A;
                color: #FFFEFC;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 17px;
              "
            >
              🚚
            </div>

            <div>
              <div
                style="
                  color: #4E342E;
                  font-size: 13px;
                  font-weight: 800;
                "
              >
                Out for Delivery
              </div>

              <div
                style="
                  color: #9A8B82;
                  font-size: 11px;
                  margin-top: 2px;
                "
              >
                Driver is on the way
              </div>
            </div>

          </div>

          <!-- Delivery progress -->
          <div
            style="
              height: 5px;
              background: #E8E2DD;
              border-radius: 10px;
              overflow: hidden;
            "
          >
            <div
              style="
                width: 68%;
                height: 100%;
                background: #D17A4A;
                border-radius: 10px;
              "
            ></div>
          </div>

          <div
            style="
              display: flex;
              justify-content: space-between;
              margin-top: 7px;
              color: #9A8B82;
              font-size: 10px;
            "
          >
            <span>In transit</span>
            <span>68%</span>
          </div>

        </div>

      </div>


      <!-- Information below the map -->
      <div
        class="connect-tracking-information"
        style="
          padding: 20px 22px 22px;
        "
      >

        <!-- Route summary -->
        <div
          class="connect-tracking-route-summary"
          style="
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 14px;
            margin-bottom: 18px;
          "
        >

          <!-- Pickup -->
          <div>
            <div
              style="
                color: #9A8B82;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 1px;
                margin-bottom: 5px;
              "
            >
              PICKUP
            </div>

            <div
              style="
                color: #4E342E;
                font-size: 14px;
                font-weight: 700;
              "
            >
              Supplier Warehouse
            </div>

            <div
              style="
                color: #9A8B82;
                font-size: 12px;
                margin-top: 3px;
              "
            >
              Durban
            </div>
          </div>

          <!-- Route arrow -->
          <div
            style="
              color: #D17A4A;
              font-size: 20px;
              font-weight: 700;
            "
          >
            →
          </div>

          <!-- Destination -->
          <div style="text-align: right;">
            <div
              style="
                color: #9A8B82;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 1px;
                margin-bottom: 5px;
              "
            >
              DESTINATION
            </div>

            <div
              style="
                color: #4E342E;
                font-size: 14px;
                font-weight: 700;
              "
            >
              Your Business
            </div>

            <div
              style="
                color: #9A8B82;
                font-size: 12px;
                margin-top: 3px;
              "
            >
              Durban
            </div>
          </div>

        </div>


        <!-- Tracking statistics -->
        <div
          class="connect-tracking-stats"
          style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          "
        >

          <!-- Status -->
          <div
            style="
              background: #F8F5F2;
              border-radius: 12px;
              padding: 13px 15px;
            "
          >
            <div
              style="
                color: #9A8B82;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 1px;
                margin-bottom: 5px;
              "
            >
              STATUS
            </div>

            <div
              style="
                color: #4E342E;
                font-size: 14px;
                font-weight: 700;
              "
            >
              In Transit
            </div>
          </div>


          <!-- GPS -->
          <div
            style="
              background: #F8F5F2;
              border-radius: 12px;
              padding: 13px 15px;
            "
          >
            <div
              style="
                color: #9A8B82;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 1px;
                margin-bottom: 5px;
              "
            >
              GPS
            </div>

            <div
              style="
                color: #47704A;
                font-size: 14px;
                font-weight: 700;
              "
            >
              Location Active
            </div>
          </div>


          <!-- Estimated arrival -->
          <div
            style="
              background: #F8F5F2;
              border-radius: 12px;
              padding: 13px 15px;
            "
          >
            <div
              style="
                color: #9A8B82;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 1px;
                margin-bottom: 5px;
              "
            >
              EST. ARRIVAL
            </div>

            <div
              style="
                color: #4E342E;
                font-size: 14px;
                font-weight: 700;
              "
            >
              ~ 25 minutes
            </div>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>


<script setup>
// Import the reusable tracking map component.
import TrackingMap from '../components/tracking/TrackingMap.vue'
</script>

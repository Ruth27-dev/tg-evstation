import ActivityKit
import Foundation

struct ChargingActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var status: String
        var batteryPercent: Double
        var currentPowerKw: Double
        var averagePowerKw: Double
        var energyKwh: Double
        var chargingMinutes: Double
        var costSoFar: Double
        var lastUpdatedAt: Date
    }

    var chargerName: String
    var sessionId: String
}

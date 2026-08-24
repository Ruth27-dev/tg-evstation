import ActivityKit
import Foundation

@objc(ChargingActivityModule)
class ChargingActivityModule: NSObject {

    @objc static func requiresMainQueueSetup() -> Bool { false }

    private static var currentActivity: Any?

    private static func contentState(from payload: NSDictionary) -> ChargingActivityAttributes.ContentState {
        ChargingActivityAttributes.ContentState(
            status: payload["status"] as? String ?? "Charging",
            batteryPercent: (payload["batteryPercent"] as? NSNumber)?.doubleValue ?? 0,
            currentPowerKw: (payload["currentPowerKw"] as? NSNumber)?.doubleValue ?? 0,
            averagePowerKw: (payload["averagePowerKw"] as? NSNumber)?.doubleValue ?? 0,
            energyKwh: (payload["energyKwh"] as? NSNumber)?.doubleValue ?? 0,
            chargingMinutes: (payload["chargingMinutes"] as? NSNumber)?.doubleValue ?? 0,
            costSoFar: (payload["costSoFar"] as? NSNumber)?.doubleValue ?? 0,
            lastUpdatedAt: Date()
        )
    }

    @objc func startActivity(_ payload: NSDictionary) {
        guard #available(iOS 16.1, *) else { return }
        guard ActivityAuthorizationInfo().areActivitiesEnabled else { return }

        let attributes = ChargingActivityAttributes(
            chargerName: payload["chargerName"] as? String ?? "TAN EV Charger",
            sessionId: payload["sessionId"] as? String ?? ""
        )
        let state = ChargingActivityModule.contentState(from: payload)

        do {
            let activity: Activity<ChargingActivityAttributes>
            if #available(iOS 16.2, *) {
                activity = try Activity<ChargingActivityAttributes>.request(
                    attributes: attributes,
                    content: .init(state: state, staleDate: nil),
                    pushType: nil
                )
            } else {
                activity = try Activity<ChargingActivityAttributes>.request(
                    attributes: attributes,
                    contentState: state,
                    pushType: nil
                )
            }
            ChargingActivityModule.currentActivity = activity
        } catch {
            NSLog("ChargingActivityModule: failed to start Live Activity: \(error)")
        }
    }

    @objc func updateActivity(_ payload: NSDictionary) {
        guard #available(iOS 16.1, *) else { return }
        guard let activity = ChargingActivityModule.currentActivity as? Activity<ChargingActivityAttributes> else { return }

        let state = ChargingActivityModule.contentState(from: payload)
        Task {
            if #available(iOS 16.2, *) {
                await activity.update(.init(state: state, staleDate: nil))
            } else {
                await activity.update(using: state)
            }
        }
    }

    @objc func endActivity(_ payload: NSDictionary) {
        guard #available(iOS 16.1, *) else { return }
        guard let activity = ChargingActivityModule.currentActivity as? Activity<ChargingActivityAttributes> else { return }

        let state = ChargingActivityModule.contentState(from: payload)
        ChargingActivityModule.currentActivity = nil
        Task {
            if #available(iOS 16.2, *) {
                await activity.end(
                    .init(state: state, staleDate: nil),
                    dismissalPolicy: .after(Date().addingTimeInterval(10))
                )
            } else {
                await activity.end(
                    using: state,
                    dismissalPolicy: .after(Date().addingTimeInterval(10))
                )
            }
        }
    }
}

import ActivityKit
import SwiftUI
import WidgetKit

private func formatMinutes(_ minutes: Double) -> String {
    "\(Int(minutes.rounded())) min"
}

private func formatKw(_ value: Double) -> String {
    String(format: "%.1f kW", value)
}

private func formatKwh(_ value: Double) -> String {
    String(format: "%.1f kWh", value)
}

private func formatCost(_ value: Double) -> String {
    String(format: "$%.2f", value)
}

private func chargingDetailURL(sessionId: String) -> URL? {
    guard let encodedSessionId = sessionId.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
        return URL(string: "tanevcharger://charging-detail")
    }
    return URL(string: "tanevcharger://charging-detail?sessionId=\(encodedSessionId)")
}

private struct ChargingIcon: View {
    let size: CGFloat

    var body: some View {
        Image("ChargingImage")
            .resizable()
            .scaledToFill()
            .frame(width: size, height: size)
            .clipShape(RoundedRectangle(cornerRadius: size * 0.25))
    }
}

private struct StatColumn: View {
    let title: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(title)
                .font(.caption2)
                .foregroundStyle(.secondary)
            Text(value)
                .font(.subheadline.bold())
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

struct ChargingActivityWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: ChargingActivityAttributes.self) { context in
            LockScreenView(attributes: context.attributes, state: context.state)
                .activityBackgroundTint(Color.black)
                .activitySystemActionForegroundColor(Color.white)
                .widgetURL(chargingDetailURL(sessionId: context.attributes.sessionId))
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(context.attributes.chargerName)
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                        Text("\(context.state.status) \(Int(context.state.batteryPercent.rounded()))%")
                            .font(.headline.bold())
                            .foregroundStyle(.green)
                            .minimumScaleFactor(0.7)
                            .lineLimit(1)
                    }
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Image("ChargingImage")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 70, height: 46)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(alignment: .leading, spacing: 8) {
                        ProgressView(value: min(max(context.state.batteryPercent, 0), 100), total: 100)
                            .tint(.green)
                        HStack {
                            StatColumn(title: "Power", value: formatKw(context.state.currentPowerKw))
                            StatColumn(title: "Energy", value: formatKwh(context.state.energyKwh))
                            StatColumn(title: "Duration", value: formatMinutes(context.state.chargingMinutes))
                            StatColumn(title: "Cost", value: formatCost(context.state.costSoFar))
                        }
                    }
                }
            } compactLeading: {
                ChargingIcon(size: 16)
            } compactTrailing: {
                Text("\(Int(context.state.batteryPercent.rounded()))%")
                    .font(.caption.bold())
            } minimal: {
                ChargingIcon(size: 16)
            }
            .widgetURL(chargingDetailURL(sessionId: context.attributes.sessionId))
        }
    }
}

private struct LockScreenView: View {
    let attributes: ChargingActivityAttributes
    let state: ChargingActivityAttributes.ContentState

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            VStack(alignment: .leading, spacing: 6) {
                Text(attributes.chargerName)
                    .font(.caption)
                    .foregroundStyle(.secondary)

                Text("\(state.status) \(Int(state.batteryPercent.rounded()))%")
                    .font(.system(size: 26, weight: .bold))
                    .foregroundStyle(.green)
                    .minimumScaleFactor(0.7)

                HStack(spacing: 14) {
                    Text("Power \(formatKw(state.currentPowerKw))")
                    Text("Energy \(formatKwh(state.energyKwh))")
                }
                .font(.caption)
                .foregroundStyle(.secondary)

                HStack(spacing: 14) {
                    Text("Duration \(formatMinutes(state.chargingMinutes))")
                    Text("Cost \(formatCost(state.costSoFar))")
                }
                .font(.caption)
                .foregroundStyle(.secondary)

                ProgressView(value: min(max(state.batteryPercent, 0), 100), total: 100)
                    .tint(.green)
                    .padding(.top, 4)
            }

            Image("ChargingImage")
                .resizable()
                .scaledToFit()
                .frame(width: 110, height: 70)
        }
        .padding()
    }
}
